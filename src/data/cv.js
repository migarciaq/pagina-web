// Redacted CV data — single source for the five content sections (Perfil,
// Formación, Experiencia Laboral, Habilidades, Contacto). This is the
// redaction boundary: see scripts/pii-rules.mjs / src/data/cv.pii.test.js
// for the patterns this module MUST satisfy.
//
// PUBLISHED (approved): full name, academic email, degree names + completion
// month/year, informal education (institution + course + month/year), job
// titles + employer names + month/year ranges, total experience summary.
//
// NEVER PUBLISHED (excluded entirely, not even partially or masked): cedula
// number, exact home address, exact birth date, tarjeta profesional
// registration number, phone numbers. Only city-level location is used.
//
// Content note: the source "Hoja de Vida" (Formato Único) does not collect
// an institution name for the two formal degrees below (Ingeniería Física,
// Maestría en Ciencias - Física) — that table only records the modality,
// title, and completion date. The Maestría entry's `institucion` is set to
// "Universidad Nacional de Colombia" based on the published academic email
// domain (unal.edu.co), which is a public, institution-issued identifier,
// not an inference about undisclosed personal data. The Ingeniería Física
// entry's `institucion` is left blank because no equivalent evidence exists
// in the source document — do not fabricate it.
export const cv = {
  perfil: {
    nombre: 'Maria Isabel Garcia Quimbayo',
    titular: 'Ingeniera Física',
    ubicacion: 'Manizales, Caldas, Colombia',
    email: 'migarciaq@unal.edu.co',
    resumen:
      'Ingeniera Física con experiencia en investigación y gestión administrativa en los sectores público y privado, actualmente cursando una Maestría en Ciencias - Física.',
    experienciaTotal:
      '2 años 9 meses en el sector público · 1 año 8 meses en el sector privado',
  },
  formacion: [
    {
      titulo: 'Maestría en Ciencias - Física',
      institucion: 'Universidad Nacional de Colombia',
      periodo: 'En curso',
      estado: 'En curso',
    },
    {
      titulo: 'Ingeniería Física',
      institucion: '',
      periodo: '09/2021',
      estado: 'Graduada',
    },
    {
      titulo: 'Desarrollo de software',
      institucion: 'Universidad del Norte',
      periodo: '10/2022',
      estado: 'Educación informal',
    },
    {
      titulo: 'Programación básica',
      institucion: 'Universidad del Norte',
      periodo: '08/2022',
      estado: 'Educación informal',
    },
    {
      titulo: 'Fundamentos de programación',
      institucion: 'Universidad del Norte',
      periodo: '06/2022',
      estado: 'Educación informal',
    },
    {
      titulo: 'English dot works 2',
      institucion: 'SENA',
      periodo: '09/2019',
      estado: 'Educación informal',
    },
    {
      titulo: 'English dot works 1',
      institucion: 'SENA',
      periodo: '06/2019',
      estado: 'Educación informal',
    },
    {
      titulo: 'English dot works beginner',
      institucion: 'SENA',
      periodo: '05/2019',
      estado: 'Educación informal',
    },
  ],
  experiencia: [
    {
      cargo: 'Administrativa en Proyecto',
      organizacion: 'Universidad Tecnológica de Pereira',
      periodo: '01/2025 - Actual',
      sector: 'Público',
      descripcion: 'Facultad de Ingenierías',
    },
    {
      cargo: 'Ingeniera Física',
      organizacion: 'Universidad Nacional de Colombia - Sede Manizales',
      periodo: '05/2025 - 09/2025',
      sector: 'Público',
      descripcion: 'Dirección de Investigación y Extensión Sede',
    },
    {
      cargo: 'Ingeniera Física',
      organizacion: 'Universidad Nacional de Colombia - Sede Manizales',
      periodo: '05/2024 - 12/2024',
      sector: 'Público',
      descripcion: 'Dirección de Investigación y Extensión Sede',
    },
    {
      cargo: 'Administrativa en Proyecto',
      organizacion: 'Universidad Tecnológica de Pereira',
      periodo: '02/2024 - 12/2024',
      sector: 'Público',
      descripcion: 'Facultad de Ingenierías',
    },
    {
      cargo: 'Investigador Asistente',
      organizacion: 'Universidad Nacional de Colombia - Sede Manizales',
      periodo: '12/2023 - 02/2024',
      sector: 'Público',
      descripcion: 'División de Investigación',
    },
    {
      cargo: 'Asistente Administrativa',
      organizacion: 'Universidad Nacional de Colombia - Sede Manizales',
      periodo: '10/2023 - 01/2024',
      sector: 'Público',
      descripcion: 'División de Investigación',
    },
    {
      cargo: 'Asistente Administrativa',
      organizacion: 'DunderLab SAS',
      periodo: '03/2023 - 06/2023',
      sector: 'Privado',
      descripcion: 'Asistencia Administrativa',
    },
    {
      cargo: 'Formador',
      organizacion: 'Comdata Colombia S.A.S',
      periodo: '05/2022 - 03/2023',
      sector: 'Privado',
      descripcion: 'Formación',
    },
    {
      cargo: 'Operador I 48 Horas',
      organizacion: 'Comdata Colombia S.A.S',
      periodo: '09/2021 - 05/2022',
      sector: 'Privado',
      descripcion: 'Operativo',
    },
  ],
  habilidades: [
    {
      categoria: 'Inglés',
      items: ['English dot works beginner', 'English dot works 1', 'English dot works 2'],
    },
    {
      categoria: 'Programación',
      items: ['Fundamentos de programación', 'Programación básica', 'Desarrollo de software'],
    },
  ],
  contacto: {
    email: 'migarciaq@unal.edu.co',
    ubicacion: 'Manizales, Caldas, Colombia',
  },
};
