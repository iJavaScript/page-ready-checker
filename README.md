Page ready checker
==================

How could tell a page is ready while they are many components to be render via ajax calls?

What we like to do is 

- log something when some critical components have been loaded.
- log something when both critical components and page level components have been loaded. At such point, we call "page ready".
- timeout if both thing can not be done.

