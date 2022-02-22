
export const FormularioPaciente = [
    { id : document.getElementById('NombrePaciente') , campo : 'Nombre del Paciente' },
    { id : document.getElementById('Apellido1Paciente') , campo : 'Primer Apellido del Paciente' },
    { id : document.getElementById('Apellido2Paciente') , campo : 'Segundo Apellido del Paciente' },
    { id : document.getElementById('NSS') , campo : 'Numero de Seguro Social' },
    { id : document.getElementById('Nacimiento') , campo : 'Fecha de Nacimiento' }
]

export const FormulariosVisitantes = {
    principal : [
        { id : document.getElementById('NombreVisitante') , campo : 'Nombre del Visitante' },
        { id : document.getElementById('Apellido1Visitante') , campo : 'Primer Apellido del Visitante' },
        { id : document.getElementById('Apellido2Visitante') , campo : 'Segundo Apellido del Visitante' },
        { id : document.getElementById('CURP') , campo : 'CURP' }
    ]
}

export const btn_registrar = document.getElementById('btn_registrar')
export const btn_visitante = document.getElementById('btn_visitante')
export const btn_cancelar = document.getElementById('btn_cancelar')

export const ContenedorVisitantes = document.getElementById('FormulariosVisitantes')