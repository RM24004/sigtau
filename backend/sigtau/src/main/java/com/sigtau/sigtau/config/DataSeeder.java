package com.sigtau.sigtau.config;

import com.sigtau.sigtau.entity.*;
import com.sigtau.sigtau.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Datos mínimos para arrancar: roles, un administrador, modalidades y motivos de cancelación. */
@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ModalityRepository modalityRepository;
    private final ReasonRepository reasonRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository,
                      ModalityRepository modalityRepository, ReasonRepository reasonRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.admin.email}") String adminEmail,
                      @Value("${app.admin.password}") String adminPassword) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.modalityRepository = modalityRepository;
        this.reasonRepository = reasonRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    private Role ensureRole(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role r = new Role();
            r.setName(name);
            r.setDescription(description);
            return roleRepository.save(r);
        });
    }

    @Override
    public void run(String... args) {
        Role admin = ensureRole("ADMIN", "Administrador del sistema");
        ensureRole("TUTOR", "Tutor que imparte tutorías");
        ensureRole("STUDENT", "Estudiante que se inscribe en tutorías");

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User u = new User();
            u.setName("Administrador");
            u.setEmail(adminEmail);
            u.setPhone("00000000");
            u.setPassword(passwordEncoder.encode(adminPassword));
            u.setRole(admin);
            userRepository.save(u);
            log.warn("Administrador inicial creado: {} (cambie la contraseña)", adminEmail);
        }

        if (modalityRepository.count() == 0) {
            String[][] mods = {{"Presencial", "En un aula o espacio físico"},
                               {"Virtual", "En línea mediante videollamada"},
                               {"Híbrida", "Presencial y virtual a la vez"}};
            for (String[] m : mods) {
                Modality x = new Modality();
                x.setName(m[0]);
                x.setDescription(m[1]);
                modalityRepository.save(x);
            }
        }

        if (reasonRepository.count() == 0) {
            String[][] rs = {{"Conflicto de horario", "El estudiante tiene otra actividad en ese horario"},
                             {"Ya no la necesito", "El estudiante resolvió sus dudas"},
                             {"Motivo personal", "Situación personal o de salud"},
                             {"Otro", "Otro motivo"}};
            for (String[] r : rs) {
                Reason x = new Reason();
                x.setName(r[0]);
                x.setDescription(r[1]);
                reasonRepository.save(x);
            }
        }
    }
}
