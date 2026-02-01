# guess-the-clue

[![Tests](https://github.com/mrwilson/guess-the-clue/actions/workflows/test.yaml/badge.svg)](https://github.com/mrwilson/guess-the-clue/actions/workflows/test.yaml)

Want to share your crossword clues with your friends to test?

This page (currently hosted at https://wildvale.co.uk/) lets you build a clue test page for sharing.

No backend, no account, all client-side.

The clue data is encoded within the URL fragment, so all you need to do is share the URL!

Here are some samples!
- [Spinning silk takes little up-front experience (5)](https://www.wildvale.co.uk/guess/#silk)
- [Slam nonsense tales (5)](https://www.wildvale.co.uk/guess/#tales)
- [Sister's OnlyFans cameo is a drag (2,3)](https://www.wildvale.co.uk/guess/#sister)

## Design Decisions

- No backend service
- No accounts
- Standard HTML/CSS/JS only; no libraries
- Keep accessibility score (via Lighthouse) high
