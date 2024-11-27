using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsultasOdontologicasAPI.Data;
using ConsultasOdontologicasAPI.Models;

namespace ConsultasOdontologicasAPI.Endpoints;

public static class ConsultaEndpoints
{
    public static void AdicionarConsultaEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/consultas");

        grupo.MapPost("/", AdicionarConsultaAsync).RequireAuthorization("Paciente");
        grupo.MapGet("/paciente/{pacienteId}", ConsultasPorPacienteAsync).RequireAuthorization("Paciente");
        grupo.MapGet("/dentista/{dentistaId}", ConsultasPorDentistaAsync).RequireAuthorization("Dentista");
        grupo.MapPut("/{id}", AtualizarConsultaAsync).RequireAuthorization();
        grupo.MapPut("/{id}/status", AtualizarStatusConsultaAsync).RequireAuthorization("Dentista");
        grupo.MapDelete("/{id}", RemoverConsultaAsync).RequireAuthorization("Dentista");
        grupo.MapGet("/total", TotalConsultasAsync).RequireAuthorization("Admin");
    }

    private static async Task<IResult> AdicionarConsultaAsync(AppDbContext db, Consulta consulta)
    {
        if (consulta.PacienteId <= 0 || consulta.DentistaId <= 0)
            return TypedResults.BadRequest("IDs de Paciente e Dentista são obrigatórios e devem ser válidos.");

        if (string.IsNullOrWhiteSpace(consulta.Descricao))
            return TypedResults.BadRequest("A descrição da consulta é obrigatória.");

        consulta.Status = "Pendente";
        db.Consultas.Add(consulta);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/consultas/{consulta.Id}", consulta);
    }

    private static async Task<IResult> ConsultasPorPacienteAsync(int pacienteId, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        if (pacienteId != userId)
            return TypedResults.Forbid();

        var consultas = await db.Consultas
            .Where(c => c.PacienteId == pacienteId)
            .OrderBy(c => c.DataHora)
            .ToListAsync();
        return TypedResults.Ok(consultas);
    }

    private static async Task<IResult> ConsultasPorDentistaAsync(int dentistaId, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);
        if (dentistaId != userId)
            return TypedResults.Forbid();

        var consultas = await db.Consultas
            .Where(c => c.DentistaId == dentistaId)
            .OrderBy(c => c.DataHora)
            .ToListAsync();
        return TypedResults.Ok(consultas);
    }

    private static async Task<IResult> AtualizarConsultaAsync(int id, Consulta consultaAtualizada, AppDbContext db, HttpContext httpContext)
    {
        var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);

        var consulta = await db.Consultas.FindAsync(id);
        if (consulta == null)
            return TypedResults.NotFound();

        if (role == "Paciente" && consulta.PacienteId != userId)
            return TypedResults.Forbid();

        if (role == "Dentista" && consulta.DentistaId != userId)
            return TypedResults.Forbid();

        if (consultaAtualizada.DataHora != null)
            consulta.DataHora = consultaAtualizada.DataHora;

        if (!string.IsNullOrWhiteSpace(consultaAtualizada.Descricao))
            consulta.Descricao = consultaAtualizada.Descricao;

        await db.SaveChangesAsync();
        return TypedResults.Ok(consulta);
    }

    private static async Task<IResult> AtualizarStatusConsultaAsync(int id, [FromQuery] string novoStatus, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);

        if (string.IsNullOrEmpty(novoStatus))
            return TypedResults.BadRequest("O novo status é obrigatório.");

        var consulta = await db.Consultas.FirstOrDefaultAsync(c => c.Id == id && c.DentistaId == userId);
        if (consulta == null)
            return TypedResults.NotFound("Consulta não encontrada ou não pertence ao dentista.");

        consulta.Status = novoStatus;
        await db.SaveChangesAsync();

        return TypedResults.Ok(consulta);
    }

    private static async Task<IResult> RemoverConsultaAsync(int id, AppDbContext db, HttpContext httpContext)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.Name)?.Value);

        var consulta = await db.Consultas
            .Where(c => c.Id == id && c.DentistaId == userId)
            .FirstOrDefaultAsync();

        if (consulta == null)
            return TypedResults.NotFound();

        db.Consultas.Remove(consulta);
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    private static async Task<IResult> TotalConsultasAsync(AppDbContext db)
    {
        var totalConsultas = await db.Consultas.CountAsync();
        return TypedResults.Ok(totalConsultas);
    }
}
