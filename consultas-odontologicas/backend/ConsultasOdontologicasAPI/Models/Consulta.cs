using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConsultasOdontologicasAPI.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public int DentistaId { get; set; }
        public DateTime DataHora { get; set; }
        public string Descricao { get; set; }
        public string Status { get; set; } = "Pendente";
    }
}
