const fs = require('fs');
const path = "apps/latif-client/src/app/user/user-form/user-form.component.ts";
let content = fs.readFileSync(path, 'utf8');

const before = content;

content = content.replace(
  /\{\{ isEditMode \? 'Edit user' : 'Create user' \}\}/,
  "{{ (isEditMode ? 'userForm.editTitle' : 'userForm.createTitle') | translate }}"
);

content = content.replace(
  /\{\{\s*isEditMode\s*\?\s*'Update this member[\s\S]*?'\s*:\s*'Add a new member to your workspace'\s*\}\}/,
  "{{ (isEditMode ? 'userForm.editSubtitle' : 'userForm.createSubtitle') | translate }}"
);

const replacements = [
  ['<label for="name">Name</label>', `<label for="name">{{ 'userForm.name' | translate }}</label>`],
  ['<label for="email">Email</label>', `<label for="email">{{ 'userForm.email' | translate }}</label>`],
  ['<label for="password">Password</label>', `<label for="password">{{ 'userForm.password' | translate }}</label>`],
  ['label="Cancel"', `[label]="'userForm.cancel' | translate"`],
  ['label="Save"', `[label]="'userForm.save' | translate"`],
];

for (const [oldStr, newStr] of replacements) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) {
    throw new Error(`expected 1 occurrence of ${oldStr}, found ${count}`);
  }
  content = content.replace(oldStr, newStr);
}

if (content === before) {
  throw new Error('no changes made');
}

fs.writeFileSync(path, content, 'utf8');
console.log('OK');
