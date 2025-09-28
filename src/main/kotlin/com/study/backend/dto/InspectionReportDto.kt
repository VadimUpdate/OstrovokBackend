package com.study.backend.dto

import java.util.*

data class InspectionReportRequest(
    val guestRequestId: UUID,
    val cleanRating: Int?,
    val serviceRating: Int?,
    val roomConditionRating: Int?,
    val moneyRating: Int?,
    val overallRating: Double?,
    val cleanlessComment: String?,
    val serviceComment: String?,
    val roomConditionComment: String?,
    val improvementComment: String?,
    val finalVerdict: String?,
    val status: String,
    val pointsFromAdmin: Int?
)
