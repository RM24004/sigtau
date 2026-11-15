import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canEnroll, hasTutoringStarted } from '../../src/utils/tutoringAvailability.js';
const tutoring = { tutoringDate: '2026-11-20', startTime: '10:00:00', status: 'OPEN', availableSpots: 2 };
const before = new Date('2026-11-20T09:59:59').getTime();
const start = new Date('2026-11-20T10:00:00').getTime();
test('permite inscripción antes del inicio con cupos', () => assert.equal(canEnroll(tutoring, before), true));
test('rechaza inscripción exactamente al comenzar', () => assert.equal(canEnroll(tutoring, start), false));
test('rechaza tutoría pasada aunque siga OPEN y tenga cupos', () => assert.equal(canEnroll(tutoring, start + 86400000), false));
test('rechaza tutoría cerrada', () => assert.equal(canEnroll({ ...tutoring, status: 'CLOSED' }, before), false));
test('rechaza tutoría llena', () => assert.equal(canEnroll({ ...tutoring, availableSpots: 0 }, before), false));
test('datos de fecha inválidos no habilitan acciones', () => assert.equal(canEnroll({ ...tutoring, tutoringDate: null }, before), false));
test('cancelación deja de estar disponible en el instante inicial', () => {
 assert.equal(hasTutoringStarted(tutoring, before), false);
 assert.equal(hasTutoringStarted(tutoring, start), true);
});
