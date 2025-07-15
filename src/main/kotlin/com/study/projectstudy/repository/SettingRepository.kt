package com.study.projectstudy.repository

import com.study.projectstudy.entity.Setting
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingRepository : JpaRepository<Setting, Long> {
    // можно добавить кастомные методы если нужно
}
