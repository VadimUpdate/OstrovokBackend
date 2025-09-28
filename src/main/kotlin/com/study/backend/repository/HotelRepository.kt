package com.study.backend.repository

import com.study.backend.entity.Hotel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface HotelRepository : JpaRepository<Hotel, UUID>
