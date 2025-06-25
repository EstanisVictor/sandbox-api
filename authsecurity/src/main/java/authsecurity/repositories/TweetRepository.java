package authsecurity.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import authsecurity.models.Tweet;

@Repository
public interface TweetRepository extends JpaRepository<Tweet, Long> {

}
