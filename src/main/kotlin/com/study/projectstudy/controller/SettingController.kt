package com.study.projectstudy.controller

import com.study.projectstudy.service.SettingService
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.Authentication
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.http.HttpStatus

@RestController
@RequestMapping("/api/settings")
class SettingController(private val settingService: SettingService) {

    private val logger = LoggerFactory.getLogger(SettingController::class.java)

    @GetMapping
    fun getSettings(@RequestParam(required = false) section: String): ResponseEntity<Any> {
        val authentication: Authentication = SecurityContextHolder.getContext().authentication
        val authorities = authentication.authorities
        val normalizedAuthorities = authorities.map { it.authority.replace("ROLE_", "") }

        logger.info("Received request to /api/settings with section: $section")
        logger.info("User: ${authentication.name}, Authorities: $normalizedAuthorities")

        // Секция "test" доступна для всех пользователей
        if (section == "test") {
            val settings = settingService.getSettings(section)
            return ResponseEntity.ok(settings)
        }

        // Секция "sbp" доступна только для "ROLE_ADMIN"
        if (section == "sbp" && normalizedAuthorities.contains("ADMIN")) {
            val settings = settingService.getSettings(section)
            return ResponseEntity.ok(settings)
        }

        // Если роль не соответствует, возвращаем 403
        logger.error("Access Denied: Invalid role or section for section: $section")
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied")
    }
}
