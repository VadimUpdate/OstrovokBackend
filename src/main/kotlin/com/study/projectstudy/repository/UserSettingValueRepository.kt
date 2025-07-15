package com.study.projectstudy.repository

import com.study.projectstudy.entity.User
import com.study.projectstudy.entity.UserSettingValue
import com.study.projectstudy.entity.Setting
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserSettingValueRepository : JpaRepository<UserSettingValue, Long> {
    fun findByUser(user: User): List<UserSettingValue>
    fun findByUserAndSetting(user: User, setting: Setting): UserSettingValue?
}
