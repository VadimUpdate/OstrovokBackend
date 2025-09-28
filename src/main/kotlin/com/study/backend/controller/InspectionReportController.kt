package com.study.backend.controller

import com.study.backend.dto.InspectionReportRequest
import com.study.backend.entity.GuestRequest
import com.study.backend.entity.InspectionReport
import com.study.backend.repository.GuestRequestRepository
import com.study.backend.repository.InspectionReportRepository
import com.study.backend.service.InspectionReportService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/inspection-reports")
class InspectionReportController(
    private val inspectionReportRepository: InspectionReportRepository,
    private val guestRequestRepository: GuestRequestRepository
) {

    @GetMapping
    fun getAll(): List<InspectionReport> = inspectionReportRepository.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): InspectionReport =
        inspectionReportRepository.findById(id)
            .orElseThrow { RuntimeException("Report not found with id $id") }

    @PostMapping
    fun create(@RequestBody report: InspectionReport): InspectionReport {
        val guestRequest = guestRequestRepository.findById(report.guestRequest.id)
            .orElseThrow { RuntimeException("GuestRequest not found with id ${report.guestRequest.id}") }

        return inspectionReportRepository.save(report.copy(guestRequest = guestRequest))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody updated: InspectionReport): InspectionReport {
        val existing = inspectionReportRepository.findById(id)
            .orElseThrow { RuntimeException("Report not found with id $id") }

        return inspectionReportRepository.save(updated.copy(id = existing.id))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) {
        val existing = inspectionReportRepository.findById(id)
            .orElseThrow { RuntimeException("Report not found with id $id") }
        inspectionReportRepository.delete(existing)
    }
}
