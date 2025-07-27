package com.study.backend.service

import com.study.backend.dto.SettingDto
import com.study.backend.dto.SettingSbpDto
import com.study.backend.repository.SettingRepository
import com.study.backend.repository.SettingSbpRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory

@Service
class SettingService(
    private val settingRepository: SettingRepository,
    private val settingSbpRepository: SettingSbpRepository
) {

    private val logger = LoggerFactory.getLogger(SettingService::class.java)

    fun getSettings(section: String?): List<Any> {
        val normalized = section?.trim()?.lowercase()
        logger.info(">>> Normalized section = '$normalized'")  // Логируем нормализованную секцию
        return if (normalized == "sbp") {
            logger.info("Fetching SBP settings...")
            getSettingsSbp()
        } else {
            logger.info("Fetching Normal settings...")
            getSettingsNormal()
        }
    }

    private fun getSettingsNormal(): List<SettingDto> =
        settingRepository.findAllByOrderByIdAsc().map {
            SettingDto(it.id, it.name, it.defaultValue)
        }

    private fun getSettingsSbp(): List<SettingSbpDto> =
        settingSbpRepository.findAllByOrderByIdAsc().map { SettingSbpDto.fromEntity(it) }

    @Transactional
    fun updateSetting(settingId: Long, section: String, newValue: String) {
        if (newValue.isEmpty()) {
            logger.error("New value cannot be empty for setting ID: $settingId")
            throw IllegalArgumentException("New value cannot be empty")
        }

        // Логируем изменение значения
        logger.info("Updating setting: ID=$settingId, section=$section, newValue=$newValue")

        // Преобразуем строку в булево значение, если это необходимо
        val parsedValue = when {
            newValue.equals("true", ignoreCase = true) -> true
            newValue.equals("false", ignoreCase = true) -> false
            newValue.toIntOrNull() != null -> newValue.toInt() // Если это число
            else -> newValue // Строка по умолчанию
        }

        try {
            if (section == "sbp") {
                val setting = settingSbpRepository.findById(settingId)
                    .orElseThrow { IllegalArgumentException("SBP setting not found for ID: $settingId") }
                setting.value = parsedValue.toString() // Преобразуем обратно в строку, если необходимо
                settingSbpRepository.save(setting)
                logger.info("SBP setting updated successfully: ID=$settingId")
            } else {
                val setting = settingRepository.findById(settingId)
                    .orElseThrow { IllegalArgumentException("Setting not found for ID: $settingId") }
                setting.defaultValue = parsedValue.toString() // Преобразуем обратно в строку, если необходимо
                settingRepository.save(setting)
                logger.info("Setting updated successfully: ID=$settingId")
            }
        } catch (e: Exception) {
            logger.error("Error updating setting with ID: $settingId", e)
            throw e
        }
    }


}
