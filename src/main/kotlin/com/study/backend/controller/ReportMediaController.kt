package com.study.backend.controller

import com.study.backend.entity.ReportMedia
import com.study.backend.entity.InspectionReport
import com.study.backend.repository.ReportMediaRepository
import com.study.backend.repository.InspectionReportRepository
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("/api/report-media")
class ReportMediaController(
    private val reportMediaRepository: ReportMediaRepository,
    private val inspectionReportRepository: InspectionReportRepository
) {

    @GetMapping
    fun getAll(): List<ReportMedia> = reportMediaRepository.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ReportMedia =
        reportMediaRepository.findById(id).orElseThrow { RuntimeException("Media not found") }

    @GetMapping("/{id}/download")
    fun download(@PathVariable id: UUID): ResponseEntity<ByteArray> {
        val media = getById(id)
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${media.id}")
            .contentType(MediaType.parseMediaType(media.fileType))
            .body(media.fileData)
    }

    @PostMapping
    fun upload(
        @RequestParam("reportId") reportId: UUID,
        @RequestParam("file") file: MultipartFile
    ): ReportMedia {
        val report: InspectionReport = inspectionReportRepository.findById(reportId)
            .orElseThrow { RuntimeException("Report not found") }

        val media = ReportMedia(
            report = report,
            fileData = file.bytes,
            fileType = file.contentType ?: "application/octet-stream"
        )
        return reportMediaRepository.save(media)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) {
        val media = getById(id)
        reportMediaRepository.delete(media)
    }
}
