package com.study.backend.controller

import com.study.backend.entity.InspectionReason
import com.study.backend.service.InspectionReasonService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/inspection-reasons")
class InspectionReasonController(private val service: InspectionReasonService) {

    @GetMapping
    fun getAll(): List<InspectionReason> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): InspectionReason = service.getById(id)

    @PostMapping
    fun create(@RequestBody reason: InspectionReason): InspectionReason = service.create(reason)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody updated: InspectionReason): InspectionReason =
        service.update(id, updated)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
