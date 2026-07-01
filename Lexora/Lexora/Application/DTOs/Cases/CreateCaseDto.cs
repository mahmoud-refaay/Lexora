using System.ComponentModel.DataAnnotations;

namespace Lexora.Application.DTOs.Cases;

public class CreateCaseDto
{
    [Required(ErrorMessage = "الموكل مطلوب.")]
    public int ClientId { get; set; }

    public int? ParentCaseId { get; set; }

    public int? AssignedLawyerId { get; set; }

    [MaxLength(100, ErrorMessage = "رقم القضية لا يمكن أن يزيد عن 100 حرف.")]
    public string? CaseNumber { get; set; }

    public int? CaseYear { get; set; }

    [MaxLength(100, ErrorMessage = "نوع القضية لا يمكن أن يزيد عن 100 حرف.")]
    public string? CaseType { get; set; }

    [MaxLength(200, ErrorMessage = "اسم المحكمة لا يمكن أن يزيد عن 200 حرف.")]
    public string? CourtName { get; set; }

    [MaxLength(100, ErrorMessage = "اسم الدائرة لا يمكن أن يزيد عن 100 حرف.")]
    public string? CourtCircuit { get; set; }

    [Required(ErrorMessage = "صفة الموكل مطلوبة.")]
    [MaxLength(50)]
    public string ClientRole { get; set; } = "Plaintiff"; // Plaintiff or Defendant

    [MaxLength(200, ErrorMessage = "اسم الخصم لا يمكن أن يزيد عن 200 حرف.")]
    public string? OpponentName { get; set; }

    [MaxLength(200, ErrorMessage = "اسم محامي الخصم لا يمكن أن يزيد عن 200 حرف.")]
    public string? OpponentLawyer { get; set; }

    public string? Subject { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "Open";

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
