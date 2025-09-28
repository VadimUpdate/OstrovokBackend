package com.study.backend.service

import com.study.backend.entity.ReportMedia
import com.study.backend.entity.InspectionReport
import com.study.backend.repository.ReportMediaRepository
import com.study.backend.repository.InspectionReportRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class ReportMediaService(
    private val reportMediaRepository: ReportMediaRepository,
    private val inspectionReportRepository: InspectionReportRepository
) {

    fun getAll(): List<ReportMedia> = reportMediaRepository.findAll()

    fun getById(id: UUID): ReportMedia =
        reportMediaRepository.findById(id).orElseThrow { RuntimeException("Media not found") }

    @Transactional
    fun upload(reportId: UUID, file: MultipartFile): ReportMedia {
        val report: InspectionReport = inspectionReportRepository.findById(reportId)
            .orElseThrow { RuntimeException("Report not found") }

        val media = ReportMedia(
            report = report,
            fileData = file.bytes,
            fileType = file.contentType ?: "application/octet-stream"
        )

        return reportMediaRepository.save(media)
    }

    @Transactional
    fun delete(id: UUID) {
        val media = getById(id)
        reportMediaRepository.delete(media)
    }
}
