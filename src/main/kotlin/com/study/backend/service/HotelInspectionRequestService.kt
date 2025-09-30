package com.study.backend.service

import com.study.backend.entity.HotelInspectionRequest
import com.study.backend.repository.HotelInspectionRepository  // <--- правильное имя
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class HotelInspectionRequestService(private val repo: HotelInspectionRepository) {  // <--- правильно
    fun getAll(): List<HotelInspectionRequest> = repo.findAll()

    fun getById(id: UUID): HotelInspectionRequest =
        repo.findById(id).orElseThrow { RuntimeException("HotelInspectionRequest not found with id: $id") }

    @Transactional
    fun create(entity: HotelInspectionRequest): HotelInspectionRequest = repo.save(entity)

    @Transactional
    fun update(id: UUID, updated: HotelInspectionRequest): HotelInspectionRequest {
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
