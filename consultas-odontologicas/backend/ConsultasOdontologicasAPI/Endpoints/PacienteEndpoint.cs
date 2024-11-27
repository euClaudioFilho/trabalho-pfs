using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ConsultasOdontologicasAPI.Data;
using ConsultasOdontologicasAPI.Models;

namespace ConsultasOdontologicasAPI.Endpoints;

public static class PacienteEndpoints
{
    public static void AdicionarPacienteEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/pacientes");

        grupo.MapPost("/", AdicionarPacienteAsync).RequireAuthorization("Admin");
        grupo.MapGet("/", ListarPacientesAsync).RequireAuthorization("Admin");
        grupo.MapGet("/{id:int}", ObterPacientePorIdAsync).RequireAuthorization();
        grupo.MapPut("/{id:int}", AtualizarPacienteAsync).RequireAuthorization();
        grupo.MapDelete("/{id:int}", RemoverPacienteAsync).RequireAuthorization("Admin");
        grupo.MapGet("/total", TotalPacientesAsync).RequireAuthorization("Admin");
    }

    private static async Task<IResult> AdicionarPacienteAsync(AppDbContext db, Usuario paciente)
    {
        if (await db.Usuarios.AnyAsync(u => u.Email == paciente.Email))
            return TypedResults.BadRequest("Email já está cadastrado.");

        paciente.Role = "Paciente";
        paciente.Senha = BCrypt.Net.BCrypt.HashPassword(paciente.Senha);

        db.Usuarios.Add(paciente);
        await db.SaveChangesAsync();

        return TypedResults.Created($"/pacientes/{paciente.Id}", new { paciente.Id, paciente.Nome, paciente.Email });
    }

    private static async Task<IResult> ListarPacientesAsync(AppDbContext db)
    {
        var pacientes = await db.Usuarios
            .Where(u => u.Role == "Paciente")
            .Select(u => new { u.Id, u.Nome, u.Email })
            .ToListAsync();

        return TypedResults.Ok(pacientes);
    }

    private static async Task<IResult> ObterPacientePorIdAsync(int id, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != "Admin" && userId != id)
            return TypedResults.Forbid();

        var paciente = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Paciente");

        if (paciente == null)
            return TypedResults.NotFound("Paciente não encontrado.");

        return TypedResults.Ok(new { paciente.Id, paciente.Nome, paciente.Email });
    }

    private static async Task<IResult> AtualizarPacienteAsync(int id, Usuario pacienteAtualizado, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != "Admin" && userId != id)
            return TypedResults.Forbid();

        var paciente = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Paciente");

        if (paciente == null)
            return TypedResults.NotFound("Paciente não encontrado.");

        paciente.Nome = pacienteAtualizado.Nome;
        paciente.Email = pacienteAtualizado.Email;

        if (!string.IsNullOrEmpty(pacienteAtualizado.Senha))
            paciente.Senha = BCrypt.Net.BCrypt.HashPassword(pacienteAtualizado.Senha);

        await db.SaveChangesAsync();

        return TypedResults.Ok(new { paciente.Id, paciente.Nome, paciente.Email });
    }

    private static async Task<IResult> RemoverPacienteAsync(int id, AppDbContext db)
    {
        var paciente = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Paciente");

        if (paciente == null)
            return TypedResults.NotFound("Paciente não encontrado.");

        db.Usuarios.Remove(paciente);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static async Task<IResult> TotalPacientesAsync(AppDbContext db)
    {
        var totalPacientes = await db.Usuarios.CountAsync(u => u.Role == "Paciente");
        return TypedResults.Ok(totalPacientes);
    }
}
