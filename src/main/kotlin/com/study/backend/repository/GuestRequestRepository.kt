package com.study.backend.repository

import com.study.backend.entity.GuestRequest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface GuestRequestRepository : JpaRepository<GuestRequest, UUID>