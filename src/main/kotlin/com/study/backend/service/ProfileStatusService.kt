package com.study.backend.service

import com.study.backend.entity.ProfileStatus
import com.study.backend.repository.ProfileStatusRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfileStatusService(private val repository: ProfileStatusRepository) {

    fun getAll(): List<ProfileStatus> = repository.findAll()

    fun getById(id: Long): ProfileStatus =
        repository.findById(id).orElseThrow { RuntimeException("ProfileStatus not found with id: $id") }

    @Transactional
    fun create(profileStatus: ProfileStatus): ProfileStatus = repository.save(profileStatus)

    @Transactional
    fun update(id: Long, updated: ProfileStatus): ProfileStatus {
        val existing = getById(id)
        val toSave = existing.copy(name = updated.name)
        return repository.save(toSave)
    }

    @Transactional
    fun delete(id: Long) {
        val existing = getById(id)
        repository.delete(existing)
    }
}
