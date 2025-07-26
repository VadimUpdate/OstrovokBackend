package com.study.projectstudy.controller

import com.study.projectstudy.dto.SettingUpdateRequest
import com.study.projectstudy.service.SettingService
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.http.HttpStatus

@RestController
@RequestMapping("/api/settings")
class SettingController(private val settingService: SettingService) {

    private val logger = LoggerFactory.getLogger(SettingController::class.java)

    @GetMapping
    fun getSettings(@RequestParam(required = false) section: String): ResponseEntity<Any> {
        logger.info("Received GET request to /api/settings with section: $section")

        val authentication: Authentication = SecurityContextHolder.getContext().authentication
        val authorities = authentication.authorities
        val normalizedAuthorities = authorities.map { it.authority.replace("ROLE_", "") }

        // Логируем пользователя и его роли
        logger.info("Authenticated User: ${authentication.name}, Authorities: $normalizedAuthorities")

        // Проверка доступности для секции "test"
        if (section == "test") {
            logger.info("Section 'test' accessed by user: ${authentication.name}. Access granted.")
            val settings = settingService.getSettings(section)
            logger.info("Settings for section 'test' retrieved successfully.")
            return ResponseEntity.ok(settings)
        }

        // Проверка доступности для секции "sbp" (только для ROLE_ADMIN)
        if (section == "sbp" && normalizedAuthorities.contains("ADMIN")) {
            logger.info("Section 'sbp' accessed by user: ${authentication.name}. User has 'ADMIN' role. Access granted.")
            val settings = settingService.getSettings(section)
            logger.info("Settings for section 'sbp' retrieved successfully.")
            return ResponseEntity.ok(settings)
        }

        // Если роль не соответствует, возвращаем 403
        logger.error("Access Denied: User: ${authentication.name}, Authorities: $normalizedAuthorities, Section: $section")
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied")
    }

    @PutMapping("/{id}")
    fun updateSetting(
        @PathVariable id: Long,
        @RequestBody request: SettingUpdateRequest
    ): ResponseEntity<Any> {
        logger.info("Received request to update setting with ID: $id, section: ${request.section}")

        // Логирование тела запроса без чувствительных данных
        logger.info("Request Body: Section: ${request.section}, New Value: ${request.newValue}")

        // Проверка данных
        if (id <= 0 || request.newValue.isEmpty()) {
            return ResponseEntity.badRequest().body("ID и новое значение обязательны")
        }

        return try {
            settingService.updateSetting(id, request.section, request.newValue)
            ResponseEntity.ok("Settings updated successfully.")
        } catch (e: Exception) {
            logger.error("Error updating setting with ID: $id", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating settings: ${e.message}")
        }
    }
}