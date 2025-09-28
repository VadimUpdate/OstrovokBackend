package com.study.backend.service

import com.study.backend.entity.InspectionReport
import com.study.backend.repository.InspectionReportRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class InspectionReportService(private val reportRepository: InspectionReportRepository) {

    fun getAllReports(): List<InspectionReport> = reportRepository.findAll()

    fun getReportById(id: UUID): InspectionReport =
        reportRepository.findById(id).orElseThrow { RuntimeException("InspectionReport not found with id: $id") }

    @Transactional
    fun createReport(report: InspectionReport): InspectionReport = reportRepository.save(report)

    @Transactional
    fun updateReport(id: UUID, updatedReport: InspectionReport): InspectionReport {
        val existing = getReportById(id)
        val reportToSave = updatedReport.copy(id = existing.id)
        return reportRepository.save(reportToSave)
    }

    @Transactional
    fun deleteReport(id: UUID) {
        val report = getReportById(id)
        reportRepository.delete(report)
    }
}
