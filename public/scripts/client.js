// Function to loop through tweets in reverse, calls CreateTweetElement for each tweet
const renderTweets = function(tweets) {
  console.log("Rendering tweets:", tweets);
  $("#the-tweets").empty(); // clear the container everytime before appending the tweets
  for (let i = tweets.length - 1; i >= 0; i--) {
    $("#the-tweets").append(createTweetElement(tweets[i]));
  }
};

// Function to generate tweet from the tweet object
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

// Escape function to prevent wrongful concatenation
const escape = function (str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Function to grab tweets from server
const loadTweets = function() {
  console.log("Loading tweets...");
  $.ajax({
    type: "GET",
    url: "/tweets",
    success: (res) => {
      console.log("Tweets loaded successfully:", res);
      renderTweets(res);
    },
    error: (err) => console.error("Failed to load tweets:", err)
  });
};

$(document).ready(function() {
  console.log("Document ready");
  loadTweets();

  $("form").submit((event) => {
    event.preventDefault(); // Prevents automatic refreshing bug

    // Checks for tweet length, returns error if empty or exceeds 140 Chars.
    $("#error").slideUp(500, function() {
      if ($("#tweet-text").val().trim().length === 0) {
        $("#error span").html("Can't send empty message!");
        $("#error").slideDown(500);
        return;
      } else if ($("#tweet-text").val().length > 140) {
        $("#error span").html("You've exceeded the 140 character limit!");
        $("#error").slideDown(500);
        return;
      }

      $.ajax({
        type: "POST",
        url: "/tweets/",
        data: $("form").serialize(),
        success: () => {
          console.log("Tweet posted successfully");
          loadTweets(); 
          $("#tweet-text").val("").trigger("input"); 
        },
        error: (err) => {
          console.error("Failed to post tweet:", err);
          $("#error span").html("Send tweet failed!");
        }
      });
    });
  });
});
