package com.sigtau.sigtau.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String inicio() {
        return "SIGTAU Backend funcionando correctamente.";
    }
}

