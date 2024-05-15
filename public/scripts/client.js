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


//Function to generate tweet from the tweet object
const createTweetElement = function(tweetData) {
  let $tweet = $(`
<article>
  <header>
    <div>
      <img src=${tweetData.user.avatars} alt="profile picture">
      <span class="name">${tweetData.user.name}</span>
    </div>
    <div class="right-div">${tweetData.user.handle}</div>
  </header>
  <p>${escape(tweetData.content.text)}</p>
  <footer>
    <span>${timeago.format(tweetData.created_at)}</span>
    <div class="icon">
      <i class="fa-sharp fa-solid fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-sharp fa-solid fa-heart"></i>
    </div>
  </footer>
</article>
`);
  return $tweet;
};


  const renderTweets = function(tweets) {
    $('#tweets-container').empty(); 
  
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet); 
    }
  };

  loadTweets();

  $("#new-tweet-form").submit(function(event) {
    event.preventDefault(); 
  
    const maxChar = 140;
    const inputLength = $(this).find("#tweet-text").val().length;
    const $counter = $(this).find(".counter");
  
    $("#error-emptyMessage").slideUp("slow");
    $("#error-lengthMessage").slideUp("slow");

    if (!inputLength) {
      $("#error-emptyMessage").slideDown("slow");
      $("#error-lengthMessage").hide();
    } else if (inputLength > maxChar) {
      $("#error-lengthMessage").slideDown("slow");
      $("#error-emptyMessage").hide();
    } else {
      const newTweet = $(this).serialize();
      if (inputLength > maxChar) {
        return;
      }
      $.post("/tweets/", newTweet)
        .done(() => {
          $(this).find("#tweet-text").val("");
          $counter.val(maxChar);
          loadTweets();
        })
        .fail((error) => {
          console.error('Error posting tweet:', error);
        });
    }

    $counter.toggleClass("red", inputLength > maxChar);
  });
});
