package com.study.backend.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "report_media")
data class ReportMedia(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne
    @JoinColumn(name = "report_id")
    val report: InspectionReport,

    @Column(name = "format_file")
    val formatFile: String?, // thread file → format file

    @Column(name = "file_type")
    val fileType: String
)