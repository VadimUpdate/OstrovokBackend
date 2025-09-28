package com.study.backend.repository

import com.study.backend.entity.ProfileStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProfileStatusRepository : JpaRepository<ProfileStatus, Long>
