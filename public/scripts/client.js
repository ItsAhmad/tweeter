$(document).ready(function() {

$("#error-emptyMessage").hide();
$("#error-lengthMessage").hide();

  const loadTweets = function() {
    $.ajax({
      url: '/tweets', 
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


  const renderTweets = function(tweets) {
    $('#tweets-container').empty(); 
  
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      console.log($tweet)
      $('#tweets-container').append($tweet); 
    }
  };

  loadTweets();

$("#new-tweet-form").submit(function(event) {
    event.preventDefault();
    const maxChar = 140;
    const inputLength = $(this).find("#tweet-text").val().length;
  
    $("#error-emptyMessage").slideUp("slow");
    $("#error-lengthMessage").slideUp("slow");

    if (!inputLength) {
      $("#error-emptyMessage").slideDown("slow");
      $("#error-message-tooLong").hide();
    } else if (inputLength - maxChar > 0) {
      $("#error-lengthMessage").slideDown("slow");
      $("#error-emptyMessage").hide();
    } else {
      const newTweet = $(this).serialize();
      $.post("/tweets/", newTweet, () => {
        $(this).find("#tweet-text").val("");
        $(this).find(".counter").val(maxChar);
        loadTweets();
      });
    }
  });
});
