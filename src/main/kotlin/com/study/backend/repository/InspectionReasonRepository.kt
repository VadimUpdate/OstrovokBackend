package com.study.backend.repository

import com.study.backend.entity.InspectionReason
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface InspectionReasonRepository : JpaRepository<InspectionReason, UUID>
