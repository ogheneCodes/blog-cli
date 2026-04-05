#!/usr/bin/env node
// const inquirer = require('inquirer').default;
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

const FILE = 'posts.json';

let blogPosts = [];

// Load existing posts
if (fs.existsSync(FILE)) {
    const data = fs.readFileSync(FILE, 'utf-8');
    blogPosts = JSON.parse(data);
}

// Save posts
function savePosts() {
    fs.writeFileSync(FILE, JSON.stringify(blogPosts, null, 2));
}

// Menu
async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose action:',
            choices: ['Create Post', 'View Posts', 'Update Post', 'Delete Post', 'Exit']
        }
    ]);

    if (action === 'Create Post') await createPost();
    if (action === 'View Posts') await viewPosts();
    if (action === 'Update Post') await updatePost();
    if (action === 'Delete Post') await deletePost();
    if (action === 'Exit') process.exit();

    mainMenu();
}

// Create
async function createPost() {
    const answers = await inquirer.prompt([
        { name: 'title', message: 'Title:' },
        { name: 'content', message: 'Content:' }
    ]);

    blogPosts.push({
        id: blogPosts.length + 1,
        title: answers.title,
        content: answers.content
    });

    savePosts();
    console.log('Post created!');
}

// Read
async function viewPosts() {
    console.log(blogPosts);
}

// Update
async function updatePost() {
    const { id } = await inquirer.prompt([
        { name: 'id', message: 'Enter ID to update:' }
    ]);

    const post = blogPosts.find(p => p.id == id);
    if (!post) return console.log('Not found');

    const updated = await inquirer.prompt([
        { name: 'title', message: 'New title:', default: post.title },
        { name: 'content', message: 'New content:', default: post.content }
    ]);

    post.title = updated.title;
    post.content = updated.content;

    savePosts();
    console.log('Updated!');
}

// Delete
async function deletePost() {
    const { id } = await inquirer.prompt([
        { name: 'id', message: 'Enter ID to delete:' }
    ]);

    blogPosts = blogPosts.filter(p => p.id != id);

    savePosts();
    console.log('Deleted!');
}

// Start
mainMenu();