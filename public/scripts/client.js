$(document).ready(function() {

  const loadTweets = function() {
    $.ajax({
      url: 'http://localhost:8080/tweets', 
      method: 'GET',
      dataType: 'json',
      success: function(tweets) {
        renderTweets(tweets.reverse());
      },
      error: function(error) {
        console.error('Error loading tweets:', error);
      }
    });
  };
  
  const renderTweets = function(tweets) {
    $('#tweets-container').empty(); 
  
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      console.log($tweet)
      $('#tweets-container').append($tweet); 
    }
  };

  const createTweetElement = function(tweetData) {
    let $tweet = $(`
      <article class="tweet">
        <header class="tweet-header">
          <div class="user">
            <img class="user-icon" src="${tweetData.user.avatars}"></img> 
            <h4 class="user-name">${tweetData.user.name}</h4>
          </div>
          <div>
            <h4 class="user-handle">${tweetData.user.handle}</h4>
          </div>
        </header>
        <div class="tweet-text">
          ${(tweetData.content.text)}
        </div>
        <footer class="tweet-footer">
          <div class="tweet-response">
            <i class="fas fa-flag" id="flag"> </i>
            <i class="fas fa-retweet" id="retweet"> </i>
            <i class="fas fa-heart" id="heart"> </i>
          </div>
        </footer>
      </article>`);
    return $tweet;
  };

  loadTweets();

  $("#new-tweet-form").submit(function(event) {
    event.preventDefault();
  
    const newTweet = $(this).serialize();

    $.post("/tweets/", newTweet, () => {

      loadTweets();
  
      location.reload();
    }); 
  });
});
