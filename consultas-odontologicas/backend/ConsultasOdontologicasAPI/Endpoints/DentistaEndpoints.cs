using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ConsultasOdontologicasAPI.Data;
using ConsultasOdontologicasAPI.Models;

namespace ConsultasOdontologicasAPI.Endpoints;

public static class DentistaEndpoints
{
    public static void AdicionarDentistaEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/dentistas");

        grupo.MapPost("/", AdicionarDentistaAsync).RequireAuthorization("Admin");
        grupo.MapGet("/", ListarDentistasAsync).RequireAuthorization("AdminOuPaciente");
        grupo.MapGet("/{id:int}", ObterDentistaPorIdAsync).RequireAuthorization();
        grupo.MapPut("/{id:int}", AtualizarDentistaAsync).RequireAuthorization();
        grupo.MapDelete("/{id:int}", RemoverDentistaAsync).RequireAuthorization("Admin");
        grupo.MapGet("/total", TotalDentistasAsync).RequireAuthorization("Admin");
    }

    private static async Task<IResult> AdicionarDentistaAsync(AppDbContext db, Usuario dentista)
    {
        if (await db.Usuarios.AnyAsync(u => u.Email == dentista.Email))
            return TypedResults.BadRequest("Email já está cadastrado.");

        dentista.Role = "Dentista";
        dentista.Senha = BCrypt.Net.BCrypt.HashPassword(dentista.Senha);

        db.Usuarios.Add(dentista);
        await db.SaveChangesAsync();

        return TypedResults.Created($"/dentistas/{dentista.Id}", new { dentista.Id, dentista.Nome, dentista.Email });
    }

    private static async Task<IResult> ListarDentistasAsync(AppDbContext db)
    {
        var dentistas = await db.Usuarios
            .Where(u => u.Role == "Dentista")
            .Select(u => new { u.Id, u.Nome, u.Email })
            .ToListAsync();

        return TypedResults.Ok(dentistas);
    }

    private static async Task<IResult> ObterDentistaPorIdAsync(int id, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != "Admin" && userId != id)
            return TypedResults.Forbid();

        var dentista = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Dentista");

        if (dentista == null)
            return TypedResults.NotFound("Dentista não encontrado.");

        return TypedResults.Ok(new { dentista.Id, dentista.Nome, dentista.Email });
    }

    private static async Task<IResult> AtualizarDentistaAsync(int id, Usuario dentistaAtualizado, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != "Admin" && userId != id)
            return TypedResults.Forbid();

        var dentista = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Dentista");

        if (dentista == null)
            return TypedResults.NotFound("Dentista não encontrado.");

        dentista.Nome = dentistaAtualizado.Nome;
        dentista.Email = dentistaAtualizado.Email;

        if (!string.IsNullOrEmpty(dentistaAtualizado.Senha))
            dentista.Senha = BCrypt.Net.BCrypt.HashPassword(dentistaAtualizado.Senha);

        await db.SaveChangesAsync();

        return TypedResults.Ok(new { dentista.Id, dentista.Nome, dentista.Email });
    }

    private static async Task<IResult> RemoverDentistaAsync(int id, AppDbContext db)
    {
        var dentista = await db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.Role == "Dentista");

        if (dentista == null)
            return TypedResults.NotFound("Dentista não encontrado.");

        db.Usuarios.Remove(dentista);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static async Task<IResult> TotalDentistasAsync(AppDbContext db)
    {
        var totalDentistas = await db.Usuarios.CountAsync(u => u.Role == "Dentista");
        return TypedResults.Ok(totalDentistas);
    }
}
