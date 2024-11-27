using Microsoft.EntityFrameworkCore;
using ConsultasOdontologicasAPI.Models;

namespace ConsultasOdontologicasAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Consulta> Consultas { get; set; }
    }
}
