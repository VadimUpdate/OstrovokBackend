package com.study.backend.service

import com.study.backend.entity.City
import com.study.backend.repository.CityRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CityService(private val repo: CityRepository) {

    fun getAll(): List<City> = repo.findAll()

    fun getById(id: Long): City =
        repo.findById(id).orElseThrow { RuntimeException("City not found: $id") }

    @Transactional
    fun create(city: City): City {
        repo.findByNameIgnoreCase(city.name)?.let { throw RuntimeException("City already exists: ${city.name}") }
        return repo.save(city)
    }

    @Transactional
    fun update(id: Long, updated: City): City {
        val exist = getById(id)
        exist.name = updated.name
        exist.region = updated.region
        exist.country = updated.country
        exist.latitude = updated.latitude
        exist.longitude = updated.longitude
        return repo.save(exist)
    }

    @Transactional
    fun delete(id: Long) {
        val exist = getById(id)
        repo.delete(exist)
    }
}
