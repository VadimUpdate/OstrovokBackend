package com.study.projectstudy.repository

import com.study.projectstudy.entity.SettingSbp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingSbpRepository : JpaRepository<SettingSbp, Long> {
    fun findAllByOrderByIdAsc(): List<SettingSbp>
}
