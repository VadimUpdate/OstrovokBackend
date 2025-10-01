package com.study.backend.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "report_media")
data class ReportMedia(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    val report: InspectionReport,

    @Column(name = "file_data", nullable = false)
    @Lob
    val fileData: ByteArray, // здесь сам файл

    @Column(name = "file_type", nullable = false)
    val fileType: String, // например "image/jpeg" или "video/mp4"
)
