# Emacs Lessons: Novice Level

<img src="../assets/images/emacs-logo-png.png" width="400">

Welcome to the **Novice Level** of our Emacs learning series.  
This stage introduces you to the basics of Emacs and helps you feel comfortable working inside the editor.  
By the end, you’ll be able to open, edit, save, and navigate text files confidently from the command line.

## 🎯 Objectives

By completing this section, you will:
- Understand what Emacs is and why it’s used in ethical hacking workflows.  
- Learn how to open and close Emacs safely.  
- Get familiar with the Emacs interface.  
- Practice basic editing, saving, and navigation commands.  
- Build confidence using Emacs for small configuration and scripting tasks.


## 🧭 Table of Contents

1. [Introduction to Emacs](#introduction-to-emacs)  
2. [Installing Emacs](#installing-emacs)  
3. [Starting and Exiting Emacs](#starting-and-exiting-emacs)  
4. [Understanding the Interface](#understanding-the-interface)  
5. [Basic File Operations](#basic-file-operations)  
6. [Simple Editing Commands](#simple-editing-commands)  
7. [Saving and Exiting](#saving-and-exiting)  
8. [Practice Task](#practice-task)  
9. [Next Steps](#next-steps)


## 1. Introduction to Emacs

Emacs is a text editor that runs inside the terminal.  
It’s widely used in programming, system administration, and ethical hacking because of its flexibility and speed.  
Unlike visual editors, Emacs gives you total control through keyboard commands.

**Why learn Emacs?**
- Works in any command-line environment.  
- Offers deep customization through Emacs Lisp.  
- Encourages keyboard-based productivity.


## 2. Installing Emacs

You can install Emacs on most systems using your package manager.

**Ubuntu or Debian**
```bash
sudo apt update
sudo apt install emacs
```

**Fedora**
```bash
sudo dnf install emacs
```

**MacOS(Homebrew)**
```bash
brew install emacs
```


## 3. Starting and Exiting Emacs

To open Emacs with a new or existing file:

```bash
emacs filename.txt
```

* If the file exists, it opens in Emacs.
* If it doesn’t, Emacs will create it once you save.

To exit Emacs:

```text
C-x C-c
```

That means press `Ctrl + x`, then `Ctrl + c`.
If you have unsaved changes, Emacs will ask whether to save before quitting.

To cancel any command in progress:

```text
C-g
```

That’s your *escape key* when you make a mistake.


## 4. Understanding the Interface

When Emacs starts, you’ll see several areas:

* **Editing Area:** Where you type and edit your text.
* **Mode Line:** Displays the file name, current mode, and other details.
* **Mini Buffer:** The small line at the bottom for messages and commands.

Most actions in Emacs use keyboard shortcuts rather than menus, which keeps your hands on the keyboard and speeds up your workflow.


## 5. Basic File Operations

| Action     | Command   | Description                     |
| ---------- | --------- | ------------------------------- |
| Open file  | `C-x C-f` | Prompts for a file name to open |
| Save file  | `C-x C-s` | Saves the current file          |
| Save as    | `C-x C-w` | Saves the file with a new name  |
| Close file | `C-x k`   | Closes the current buffer       |

**Tip:** When prompted for a file name, Emacs provides auto-completion — press `Tab` to complete paths.


## 6. Simple Editing Commands

| Task                | Command          | What It Does                       |
| ------------------- | ---------------- | ---------------------------------- |
| Move cursor forward | `C-f`            | Moves one character forward        |
| Move backward       | `C-b`            | Moves one character backward       |
| Move up             | `C-p`            | Moves to the previous line         |
| Move down           | `C-n`            | Moves to the next line             |
| Delete character    | `C-d`            | Deletes the character under cursor |
| Undo                | `C-/` or `C-x u` | Undoes the last action             |

**Bonus:** You can move faster with `M-f` and `M-b` (press `Alt + f` or `Alt + b`) to jump word by word.


## 7. Saving and Exiting

Save your current work:

```text
C-x C-s
```

Exit Emacs:

```text
C-x C-c
```

If you haven’t saved your changes, Emacs will ask:

```
Save file /path/to/file? (yes or no)
```

Type `y` to save and exit, or `n` to exit without saving.

**Quick tip:** It’s good practice to save often — Emacs won’t autosave unless you enable it manually.


## 8. Practice Task

Try this short exercise to reinforce what you’ve learned.

1. Open a new file called `practice.txt`:

   ```bash
   emacs practice.txt
   ```

2. Type a few lines about your experience using the terminal.

3. Use the navigation commands to move around and edit the text:

   * `C-f`, `C-b`, `C-p`, `C-n`

4. Save the file:

   ```text
   C-x C-s
   ```

5. Exit Emacs:

   ```text
   C-x C-c
   ```

6. Reopen the file to confirm that your text was saved successfully.


## 9. Next Steps

Congratulations! You’ve completed the **Novice Level** for Emacs.
You now know how to open, edit, save, and exit files using the terminal.

In the **Operator Level**, you’ll explore:

* Working with multiple files and buffers
* Managing split windows
* Searching and replacing text
* Customizing Emacs behavior

**Tip:** Practice every day for a few minutes. The key to mastering Emacs is repetition.
