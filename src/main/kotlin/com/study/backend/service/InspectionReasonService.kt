package com.study.backend.service

import com.study.backend.entity.InspectionReason
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.ConcurrentHashMap

@Service
class InspectionReasonService {

    private val reasons = ConcurrentHashMap<UUID, InspectionReason>()

    fun getAll(): List<InspectionReason> = reasons.values.toList()

    fun getById(id: UUID): InspectionReason =
        reasons[id] ?: throw NoSuchElementException("InspectionReason with id $id not found")

    fun create(reason: InspectionReason): InspectionReason {
        reasons[reason.id] = reason
        return reason
    }

    fun update(id: UUID, updated: InspectionReason): InspectionReason {
        if (!reasons.containsKey(id)) throw NoSuchElementException("InspectionReason with id $id not found")
        reasons[id] = updated
        return updated
    }

    fun delete(id: UUID) {
        if (!reasons.containsKey(id)) throw NoSuchElementException("InspectionReason with id $id not found")
        reasons.remove(id)
    }
}
