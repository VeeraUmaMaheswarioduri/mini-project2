const socket = io();
const ctx = document.getElementById("voteChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["React", "Angular", "MongoDB", "Node.js"],
    datasets: [{
      label: "Votes",
      data: [0, 0, 0, 0],
      backgroundColor: ["blue", "red", "green", "orange"]
    }]
  }
});

function vote(option) {
  fetch("/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId: "YOUR_POLL_ID", optionId: option })
  });
}

socket.on("voteUpdate", (poll) => {
  chart.data.datasets[0].data = poll.options.map(o => o.votes);
  chart.update();
});
