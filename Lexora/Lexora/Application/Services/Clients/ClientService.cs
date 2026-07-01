using Lexora.Application.DTOs.Common;
using Lexora.Application.DTOs.Clients;
using Lexora.Application.Interfaces.Repositories;
using Lexora.Application.Interfaces.Services;
using Lexora.Domain.Exceptions;

namespace Lexora.Application.Services.Clients;

public class ClientService : IClientService
{
    private readonly IClientRepository _clientRepository;
    private readonly IClientNoteRepository _clientNoteRepository;

    public ClientService(
        IClientRepository clientRepository,
        IClientNoteRepository clientNoteRepository)
    {
        _clientRepository = clientRepository;
        _clientNoteRepository = clientNoteRepository;
    }

    public async Task<int> CreateAsync(CreateClientDto dto, int? createdByUserId = null)
    {
        // 1. التحقق من المدخلات الأساسية
        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            throw new DomainException("اسم العميل بالكامل مطلوب.");
        }

        var clientType = dto.ClientType?.Trim();
        if (string.IsNullOrEmpty(clientType) || 
            (clientType != "Individual" && clientType != "Company" && clientType != "Organization"))
        {
            throw new DomainException("نوع العميل غير صحيح. يجب أن يكون فرد أو شركة أو مؤسسة.");
        }

        // 2. إعداد كائن الدومين
        var client = new Client
        {
            ClientType = clientType,
            FullName = dto.FullName.Trim(),
            NationalId = string.IsNullOrWhiteSpace(dto.NationalId) ? null : dto.NationalId.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber) ? null : dto.PhoneNumber.Trim(),
            Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedByUserId = createdByUserId
        };

        // 3. الحفظ في قاعدة البيانات
        return await _clientRepository.CreateAsync(client);
    }

    public async Task<ClientDto?> GetByIdAsync(int id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null) return null;

        return MapToDto(client);
    }

    public async Task<PaginatedResult<ClientDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, string? status = null)
    {
        var (clients, totalCount) = await _clientRepository.GetAllAsync(pageNumber, pageSize, searchTerm, status);

        return new PaginatedResult<ClientDto>
        {
            Items = clients.Select(MapToDto),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task UpdateAsync(int id, UpdateClientDto dto, int? updatedByUserId = null)
    {
        // 1. التحقق من المدخلات
        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            throw new DomainException("اسم العميل بالكامل مطلوب.");
        }

        var clientType = dto.ClientType?.Trim();
        if (string.IsNullOrEmpty(clientType) || 
            (clientType != "Individual" && clientType != "Company" && clientType != "Organization"))
        {
            throw new DomainException("نوع العميل غير صحيح.");
        }

        var status = dto.Status?.Trim();
        if (string.IsNullOrEmpty(status) || 
            (status != "Active" && status != "Inactive" && status != "Archived"))
        {
            throw new DomainException("حالة العميل غير صحيحة.");
        }

        var existingClient = await _clientRepository.GetByIdAsync(id);
        if (existingClient == null)
        {
            throw new DomainException("العميل المطلوب تعديله غير موجود في النظام.");
        }

        // 2. تحديث الحقول
        var client = new Client
        {
            Id = id,
            ClientType = clientType,
            FullName = dto.FullName.Trim(),
            NationalId = string.IsNullOrWhiteSpace(dto.NationalId) ? null : dto.NationalId.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber) ? null : dto.PhoneNumber.Trim(),
            Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            Status = status,
            UpdatedByUserId = updatedByUserId
        };

        await _clientRepository.UpdateAsync(client);
    }

    public async Task DeleteAsync(int id, int? deletedByUserId = null)
    {
        await _clientRepository.DeleteAsync(id, deletedByUserId);
    }

    // ================================================
    // العمليات على الملاحظات (Notes Operations)
    // ================================================

    public async Task<int> AddNoteAsync(int clientId, CreateClientNoteDto dto, int? createdByUserId = null)
    {
        if (string.IsNullOrWhiteSpace(dto.Note))
        {
            throw new DomainException("نص الملاحظة مطلوب ولا يمكن أن يكون فارغاً.");
        }

        var existingClient = await _clientRepository.GetByIdAsync(clientId);
        if (existingClient == null)
        {
            throw new DomainException("العميل المرتبط بالملاحظة غير موجود.");
        }

        var note = new ClientNote
        {
            ClientId = clientId,
            Note = dto.Note.Trim(),
            CreatedByUserId = createdByUserId
        };

        return await _clientNoteRepository.CreateAsync(note);
    }

    public async Task<IEnumerable<ClientNoteDto>> GetNotesAsync(int clientId)
    {
        var existingClient = await _clientRepository.GetByIdAsync(clientId);
        if (existingClient == null)
        {
            throw new DomainException("العميل غير موجود.");
        }

        var notes = await _clientNoteRepository.GetByClientIdAsync(clientId);
        return notes.Select(MapNoteToDto);
    }

    public async Task DeleteNoteAsync(int noteId, int? userId = null)
    {
        var note = await _clientNoteRepository.GetByIdAsync(noteId);
        if (note == null)
        {
            throw new DomainException("الملاحظة المطلوبة غير موجودة.");
        }

        // ملاحظة: يمكن هنا إضافة فحص صلاحيات إضافي للتأكد أن من يحذف الملاحظة هو كاتبها أو مسؤول
        await _clientNoteRepository.DeleteAsync(noteId);
    }

    // ================================================
    // التحويل إلى DTOs (Mapping Helpers)
    // ================================================

    private static ClientDto MapToDto(Client client)
    {
        return new ClientDto
        {
            Id = client.Id,
            ClientType = client.ClientType,
            FullName = client.FullName,
            NationalId = client.NationalId,
            PhoneNumber = client.PhoneNumber,
            Email = client.Email,
            Address = client.Address,
            Notes = client.Notes,
            Status = client.Status,
            CreatedAt = client.CreatedAt,
            CreatedByUserId = client.CreatedByUserId,
            UpdatedAt = client.UpdatedAt,
            UpdatedByUserId = client.UpdatedByUserId,
            ActiveCasesCount = client.ActiveCasesCount,
            TotalCasesCount = client.TotalCasesCount
        };
    }

    private static ClientNoteDto MapNoteToDto(ClientNote note)
    {
        return new ClientNoteDto
        {
            Id = note.Id,
            ClientId = note.ClientId,
            Note = note.Note,
            CreatedAt = note.CreatedAt,
            CreatedByUserId = note.CreatedByUserId,
            AuthorName = note.AuthorName,
            UpdatedAt = note.UpdatedAt,
            UpdatedByUserId = note.UpdatedByUserId
        };
    }

    public async Task<IEnumerable<ConflictResultDto>> CheckConflictAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("اسم البحث للمطابقة غير صحيح.");
        }

        var results = await _clientRepository.CheckConflictAsync(name.Trim());
        return results.Select(r => new ConflictResultDto
        {
            EntityId = r.EntityId,
            Name = r.Name,
            Type = r.Type,
            Role = r.Role,
            Status = r.Status,
            CaseNumber = r.CaseNumber,
            CaseTitle = r.CaseTitle
        });
    }
}
