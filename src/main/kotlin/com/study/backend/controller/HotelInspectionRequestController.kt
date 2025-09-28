package com.study.backend.controller

import com.study.backend.entity.HotelInspectionRequest
import com.study.backend.service.HotelInspectionRequestService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/hotel-inspections")
class HotelInspectionRequestController(private val service: HotelInspectionRequestService) {

    @GetMapping
    fun getAll(): List<HotelInspectionRequest> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): HotelInspectionRequest = service.getById(id)

    @PostMapping
    fun create(@RequestBody entity: HotelInspectionRequest): HotelInspectionRequest = service.create(entity)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody updated: HotelInspectionRequest): HotelInspectionRequest =
        service.update(id, updated)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
