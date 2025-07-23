package com.study.projectstudy.controller

import com.study.projectstudy.service.SettingService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.nio.file.AccessDeniedException

@RestController
@RequestMapping("/api/settings")
@PreAuthorize("hasRole('ADMIN')")
class SettingController(
    private val settingService: SettingService
) {

    @GetMapping
    fun getSettings(@RequestParam section: String?): List<Any> {
        println("➡ section from controller = $section")
        val authentication = SecurityContextHolder.getContext().authentication
        val isAdmin = authentication.authorities.contains(SimpleGrantedAuthority("ROLE_ADMIN"))

        if (section == "sbp" && !isAdmin) {
            throw AccessDeniedException("Доступ запрещён")
        }

        return settingService.getSettings(section)
    }


    @PutMapping("/{id}")
    fun updateSetting(
        @PathVariable id: Long,
        @RequestBody dto: Map<String, String>
    ) {
        val newValue = dto["value"] ?: throw IllegalArgumentException("Missing value")
        val section = dto["section"] ?: "test"
        settingService.updateSetting(id, section, newValue)
    }
}
