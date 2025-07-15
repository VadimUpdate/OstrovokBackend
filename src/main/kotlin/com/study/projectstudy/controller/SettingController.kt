package com.study.projectstudy.controller

import com.study.projectstudy.dto.SettingDto
import com.study.projectstudy.entity.Setting
import com.study.projectstudy.entity.User
import com.study.projectstudy.security.CustomUserDetails
import com.study.projectstudy.service.SettingService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/settings")
class SettingController(
    private val settingService: SettingService
) {

    @GetMapping
    fun getSettings(@AuthenticationPrincipal userDetails: UserDetails): List<SettingDto> {
        val user = getUser(userDetails)  // получить сущность User
        return settingService.getSettingsForUser(user)
    }

    @PutMapping("/{id}")
    fun updateSetting(
        @PathVariable id: Long,
        @RequestBody dto: Map<String, String>,
        @AuthenticationPrincipal userDetails: UserDetails
    ) {
        val newValue = dto["value"] ?: throw IllegalArgumentException("Missing value")
        val user = getUser(userDetails)
        settingService.updateSettingValue(user, id, newValue)
    }

    private fun getUser(userDetails: UserDetails): User {
        return (userDetails as CustomUserDetails).user
    }
}

