export class Security {
  static get secret() {
    return process.env.JWT_SECRET || 'oinz7svt9a4onvoniudzfgvnzaervtoin47z';
  }
}
