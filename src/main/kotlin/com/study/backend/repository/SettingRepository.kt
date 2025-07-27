package com.study.backend.repository

import com.study.backend.entity.Setting
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingRepository : JpaRepository<Setting, Long> {
    fun findAllByOrderByIdAsc(): List<Setting>
}