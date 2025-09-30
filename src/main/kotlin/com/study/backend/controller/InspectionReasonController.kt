package com.study.backend.controller

import com.study.backend.dto.InspectionReasonRequest
import com.study.backend.entity.InspectionReason
import com.study.backend.service.InspectionReasonService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/inspection-reasons")
class InspectionReasonController(private val service: InspectionReasonService) {

    @GetMapping
    fun getAll(): List<InspectionReason> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ResponseEntity<InspectionReason> =
        try {
            ResponseEntity.ok(service.getById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }

    @PostMapping
    fun create(@RequestBody request: InspectionReasonRequest): InspectionReason {
        val reason = InspectionReason(name = request.name)
        return service.create(reason)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody request: InspectionReasonRequest): ResponseEntity<InspectionReason> =
        try {
            val existing = service.getById(id)
            val updated = existing.copy(name = request.name)
            ResponseEntity.ok(service.update(id, updated))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> =
        try {
            service.delete(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
}
