package ostrovok.secretguest.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "profiles")
data class Profile(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @OneToOne
    @JoinColumn(name = "user_id")
    val user: User,

    @Column(name = "first_name", nullable = false)
    val firstName: String,

    @Column(name = "last_name", nullable = false)
    val lastName: String,

    @Column(name = "patronymic")
    val patronymic: String? = null,

    @Column(name = "phone")
    val phone: String? = null,

    @Column(name = "city")
    val city: String? = null,

    @Column(name = "travel_interests")
    val travelInterests: String? = null,

    @Column(name = "tg_id")
    val tgId: String? = null,

    @ManyToOne
    @JoinColumn(name = "status_id")
    val status: ProfileStatus,

    @Column(name = "rating")
    val rating: Double? = null
)