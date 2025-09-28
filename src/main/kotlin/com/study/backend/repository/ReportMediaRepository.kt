package com.study.backend.repository

import com.study.backend.entity.ReportMedia
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ReportMediaRepository : JpaRepository<ReportMedia, UUID>
