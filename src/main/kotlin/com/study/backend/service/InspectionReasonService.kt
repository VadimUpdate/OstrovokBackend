package com.study.backend.service

import com.study.backend.entity.InspectionReason
import com.study.backend.repository.InspectionReasonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class InspectionReasonService(private val repo: InspectionReasonRepository) {

    fun getAll(): List<InspectionReason> = repo.findAll()

    fun getById(id: UUID): InspectionReason =
        repo.findById(id).orElseThrow { RuntimeException("InspectionReason not found with id: $id") }

    @Transactional
    fun create(reason: InspectionReason): InspectionReason = repo.save(reason)

    @Transactional
    fun update(id: UUID, updated: InspectionReason): InspectionReason {
        val existing = getById(id)
        val toSave = updated.copy(id = existing.id)
        return repo.save(toSave)
    }

    @Transactional
    fun delete(id: UUID) {
        val entity = getById(id)
        repo.delete(entity)
    }
}
